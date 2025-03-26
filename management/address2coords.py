import sys

def main():
    # Check if the correct number of arguments is provided
    if len(sys.argv) != 3:
        print("Usage: python address2coords.py <arg1> <arg2>")
        sys.exit(1)

    # Retrieve arguments
    arg1 = sys.argv[1]
    arg2 = sys.argv[2]

    # Placeholder for main logic
    print(f"Argument 1: {arg1}")
    print(f"Argument 2: {arg2}")

if __name__ == "__main__":
    main()