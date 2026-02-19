import argparse
import json
import os
from collections import defaultdict

import numpy as np

from prediction import classes, predict_image


IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


def iter_labeled_images(test_dir):
    for label_name in sorted(os.listdir(test_dir)):
        label_dir = os.path.join(test_dir, label_name)
        if not os.path.isdir(label_dir):
            continue
        for root, _, files in os.walk(label_dir):
            for name in files:
                ext = os.path.splitext(name)[1].lower()
                if ext in IMAGE_EXTS:
                    yield label_name, os.path.join(root, name)


def safe_div(num, den):
    return (num / den) if den else 0.0


def main():
    parser = argparse.ArgumentParser(
        description="Evaluate plant disease model on labeled test images."
    )
    parser.add_argument(
        "--test_dir",
        default="test",
        help='Path with class folders, e.g. test/"Tomato Early Blight"/*.jpg',
    )
    parser.add_argument(
        "--show_misclassified",
        type=int,
        default=20,
        help="How many wrong predictions to print.",
    )
    parser.add_argument(
        "--save_json",
        default="",
        help="Optional path to save raw results JSON.",
    )
    args = parser.parse_args()

    test_dir = os.path.abspath(args.test_dir)
    if not os.path.isdir(test_dir):
        print(f"ERROR: test_dir not found: {test_dir}")
        return

    label_to_idx = {label: i for i, label in enumerate(classes)}
    y_true = []
    y_pred = []
    records = []
    unknown_truth_labels = defaultdict(int)
    failed_files = []

    total = 0
    for true_label, path in iter_labeled_images(test_dir):
        total += 1
        if true_label not in label_to_idx:
            unknown_truth_labels[true_label] += 1
            continue
        try:
            out = predict_image(path)
            pred_label = out["label"]
            confidence = float(out["confidence"])
            if pred_label not in label_to_idx:
                failed_files.append(
                    {"path": path, "error": f"unknown predicted label: {pred_label}"}
                )
                continue
            y_true.append(label_to_idx[true_label])
            y_pred.append(label_to_idx[pred_label])
            records.append(
                {
                    "path": path,
                    "true_label": true_label,
                    "pred_label": pred_label,
                    "confidence": confidence,
                    "correct": true_label == pred_label,
                }
            )
        except Exception as exc:
            failed_files.append({"path": path, "error": str(exc)})

    if total == 0:
        print(f"No images found in: {test_dir}")
        return

    if not y_true:
        print("No valid labeled images were evaluated.")
        if unknown_truth_labels:
            print("Unknown folder labels (not in model classes):")
            for k, v in sorted(unknown_truth_labels.items()):
                print(f"- {k}: {v}")
        return

    y_true = np.array(y_true, dtype=np.int32)
    y_pred = np.array(y_pred, dtype=np.int32)
    num_classes = len(classes)
    cm = np.zeros((num_classes, num_classes), dtype=np.int32)
    for t, p in zip(y_true, y_pred):
        cm[t, p] += 1

    accuracy = float((y_true == y_pred).mean())
    evaluated = len(y_true)

    print(f"Test dir: {test_dir}")
    print(f"Total files found: {total}")
    print(f"Evaluated files: {evaluated}")
    print(f"Failed files: {len(failed_files)}")
    print(f"Accuracy: {accuracy * 100:.2f}%")

    if unknown_truth_labels:
        print("\nUnknown folder labels (skipped):")
        for k, v in sorted(unknown_truth_labels.items()):
            print(f"- {k}: {v}")

    print("\nPer-class metrics:")
    print("class | precision | recall | f1 | support")
    for i, label in enumerate(classes):
        tp = cm[i, i]
        fp = int(cm[:, i].sum() - tp)
        fn = int(cm[i, :].sum() - tp)
        support = int(cm[i, :].sum())
        precision = safe_div(tp, tp + fp)
        recall = safe_div(tp, tp + fn)
        f1 = safe_div(2 * precision * recall, precision + recall)
        if support > 0:
            print(
                f"{label} | {precision:.3f} | {recall:.3f} | {f1:.3f} | {support}"
            )

    print("\nConfusion matrix (rows=true, cols=pred):")
    print("Labels index map:")
    for i, label in enumerate(classes):
        print(f"{i}: {label}")
    print(cm)

    mis = [r for r in records if not r["correct"]]
    mis.sort(key=lambda x: x["confidence"], reverse=True)
    if args.show_misclassified > 0:
        print(f"\nTop {min(args.show_misclassified, len(mis))} misclassifications:")
        for row in mis[: args.show_misclassified]:
            print(
                f"- {row['path']} | true={row['true_label']} | pred={row['pred_label']} | conf={row['confidence']:.2f}"
            )

    if failed_files:
        print("\nFailed files:")
        for row in failed_files[:50]:
            print(f"- {row['path']} | error={row['error']}")
        if len(failed_files) > 50:
            print(f"... and {len(failed_files) - 50} more")

    if args.save_json:
        out = {
            "test_dir": test_dir,
            "total_found": total,
            "evaluated": evaluated,
            "failed_count": len(failed_files),
            "accuracy": accuracy,
            "unknown_truth_labels": dict(unknown_truth_labels),
            "records": records,
            "failed_files": failed_files,
        }
        out_path = os.path.abspath(args.save_json)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(out, f, indent=2)
        print(f"\nSaved JSON report: {out_path}")


if __name__ == "__main__":
    main()
