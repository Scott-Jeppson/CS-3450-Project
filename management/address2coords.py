import sys
import csv

def main():
    # Check if the correct number of arguments is provided
    if len(sys.argv) != 3:
        print("Usage: python address2coords.py <Input CSV file name (located in input folder)> <Name of Text File Output>")
        sys.exit(1)

    # Retrieve arguments
    input = sys.argv[1]
    output = sys.argv[2]

    # Open the input file located in the input/ folder
    try:
        with open(f"input/{input}", mode='r', encoding='utf-8') as infile:
            reader = csv.reader(infile)
            # Process the CSV file as needed
            # Open the output file in append mode, creating it if it doesn't exist
            with open(f"output/{output}", mode='a', encoding='utf-8', newline="") as outfile:
                # Example: Write a header to the output file
                writer = csv.writer(outfile)
                writer.writerow(["Name/Address", "Latitude", "Longitude"])

                # Skip the header row
                next(reader)

                for row in reader:
                    # Check for correct county and mode
                    if len(row) > 6 and row[6] == "Utah":
                        if len(row) > 14 and row[14] == "Bus":
                            # Write the specified columns to the output file
                            writer.writerow([row[4], row[9], row[10]])

    except FileNotFoundError:
        print(f"Error: The file 'input/{input}' does not exist.")
        sys.exit(1)
       
            
if __name__ == "__main__":
    main()