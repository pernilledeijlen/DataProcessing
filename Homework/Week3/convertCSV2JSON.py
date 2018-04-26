#!/usr/bin/python
# Name: Pernille Deijlen
# Student number: 10747354
"""
This script converts a CSV file into JSON format.
Current account balance (BoP in US dollars) in the Netherlands, years 1990 - 2015
data source: World Development Indicators
"""

#meer jaren toevoegen!! iets van 10-15

import csv
import json

csv_name = "dutchBoP.csv"
csv_file = open(csv_name, "r")
json_filename = csv_name.split(".csv")[0] + ".json"
json_file = open(json_filename, "w")

reader = csv.DictReader(csv_file, fieldnames = ("year", "BoP"))
data = json.dumps([row for row in reader])
json_file.write(data)

csv_file.close()
json_file.close()