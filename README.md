
This script reads in a file called libraries.txt that is formatted with each line looking like this:
```
numpy==1.11.0
pandas==0.22.0
<library_name>==<version>
```
It then uses github's search function to search for that word, and returns the information of the first entry it finds. This information is dumped into an output.txt file which looks like this. 

```
bz2file==0.98	https://github.com/nvawda/bz2file	Python library for reading and writing bzip2-compressed files.

blinker==1.3	https://github.com/jek/blinker	A fast Python in-process signal/event dispatching system.
```
