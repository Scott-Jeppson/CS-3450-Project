import csv
import re
import json
import os
import sys
import requests

def sanitize_stop_name(stop_name):
    return re.sub(r'\(.*?\)', '', stop_name).strip()

def main():
    API_KEY = "AIzaSyBCbQD5nuGeFzqsieLT_GxAlJibEWVmmmg"
    if len(sys.argv) != 3:
        print("Usage: python address2coords.py <input_csv> <output_csv>")
        sys.exit(1)

    input_file = os.path.join("input", sys.argv[1])
    output_file = os.path.join("output", sys.argv[2])

    if not os.path.exists("output"):
        os.makedirs("output")

    try:
        with open(input_file, mode='r', newline='', encoding='utf-8') as infile:
            reader = csv.reader(infile)
            next(reader)  # Skip the header row

            with open(output_file, mode='a', newline='', encoding='utf-8') as outfile:
                writer = csv.writer(outfile)

                for row in reader:
                    stop_name = sanitize_stop_name(row[5])
                    city = row[6]
                    county = row[7]

                    url = f"https://maps.googleapis.com/maps/api/geocode/json?key={API_KEY}&address={stop_name},+{city},+{county}"

                    apiResponse = requests.get(url)

                    try:
                        location = apiResponse["results"][0]["geometry"]["location"]
                        lati = location["lat"]
                        longi = location["lng"]
                        writer.writerow([stop_name, lati, longi])
                    except (KeyError, IndexError):
                        print(f"Error processing row: {row}")

    except FileNotFoundError:
        print(f"Input file {input_file} not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()