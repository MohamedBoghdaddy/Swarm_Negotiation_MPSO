from sklearn.metrics import classification_report, confusion_matrix
import numpy as np
import pandas as pd

def compute_confusion_metrics(true_labels, predicted_labels, algo_name=None):
    """
    Compute evaluation metrics for classification: precision, recall, f1-score, support, and confusion matrix.

    Args:
        true_labels (List[str/int]): Ground truth labels (e.g., 'ABC', 'PSO', 'GA')
        predicted_labels (List[str/int]): Predicted labels from algorithm results
        algo_name (str, optional): Label for output identification

    Returns:
        Dict: Dictionary with detailed metrics and confusion matrix
    """
    report = classification_report(true_labels, predicted_labels, output_dict=True)
    conf_matrix = confusion_matrix(true_labels, predicted_labels)

    result = {
        "algorithm": algo_name,
        "classification_report": report,
        "confusion_matrix": conf_matrix.tolist()  # for JSON serialization
    }

    return result

def print_metrics(result_dict):
    """
    Pretty print the results for debugging or logging.
    """
    algo = result_dict.get("algorithm", "N/A")
    print(f"\n📌 Metrics for: {algo}")
    print("Confusion Matrix:")
    print(np.array(result_dict['confusion_matrix']))
    print("\nClassification Report:")
    df = pd.DataFrame(result_dict['classification_report']).transpose()
    print(df.round(3))
