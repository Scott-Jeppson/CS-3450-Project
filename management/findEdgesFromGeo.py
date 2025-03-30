import csv
import sys
import sumolib
import pyproj
import rtree

def main():
    # Ensure the correct number of arguments are provided
    if len(sys.argv) != 3:
        print("Usage: python findEdgesFromGeo.py <input_file.csv> <output_file.csv>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    net = sumolib.net.readNet('../sumo/OremConfig/osm.net.xml.gz')
    radius = 100  # meters

    try:
        # Open the input file for reading
        with open(f"input/{input_file}", mode='r', newline='', encoding='utf-8') as infile:
            reader = csv.reader(infile)
            
            # Open the output file for writing
            with open(f"output/{output_file}", mode='w', newline='', encoding='utf-8') as outfile:
                writer = csv.writer(outfile)
                
                # Skip the header row in the input file
                next(reader, None)

                # Write the header row to the output file
                writer.writerow(["Name", "Distance", "ClosestEdge"])

                # Iterate through each row in the input file
                for row in reader:
                    if len(row) != 3:
                        print(f"Skipping invalid row: {row}")
                        continue
                    
                    # Parse the columns into variables
                    name, lat, lon = row

                    # Convert lat and lon to floats
                    try:
                        lat = float(lat)
                        lon = float(lon)
                    except ValueError:
                        print(f"Skipping row with invalid coordinates: {row}")
                        continue
                    
                    # Convert longitude and latitude to x, y coordinates
                    x, y = net.convertLonLat2XY(lon, lat)
                    edges = net.getNeighboringEdges(x, y, radius)
                    # pick the closest edge
                    if len(edges) > 0:
                        distancesAndEdges = sorted([(dist, edge) for edge, dist in edges], key=lambda x:x[0])
                        dist, closestEdge = distancesAndEdges[0]
                    
                        # Write the new values to the output file
                        writer.writerow([name, dist, closestEdge])
                    else:
                        # Handle the case where no edges are found
                        print(f"No edges found for coordinates: {lat}, {lon}")
                        writer.writerow([name, "No edge found", "No edge found"])

        print(f"Processing complete. Output written to output/{output_file}")

    except FileNotFoundError:
        print(f"Error: File {input_file} not found.")
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
    sys.exit(0)