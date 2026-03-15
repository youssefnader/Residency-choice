import pandas as pd
import sys

# Set encoding for safe printing
sys.stdout.reconfigure(encoding='utf-8')

try:
    df = pd.read_excel('e:/Antigravity Projects/The residency/candidates.xlsx')
    print("Columns:", ", ".join(df.columns.tolist()))
    print("\nFirst 3 rows:")
    # Print as CSV string for better compatibility in logs
    print(df.head(3).to_csv(index=False))
except Exception as e:
    print(f"Error reading Excel: {e}")
