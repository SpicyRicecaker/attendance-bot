#!/usr/bin/env fish
# Set directory of autzoom_node by getting filename, then evaluating directory
set DIR (dirname (status --current-filename))
# Add some formatting
echo "
-----------[new entry]-----------" >> output.txt
# Run our class command there, append to output
yarn --cwd $DIR class >> output.txt
echo "--------------[date]-------------" >> output.txt
# For now just print the contents of date.json and store it in output
cat $DIR/date.json >> output.txt
