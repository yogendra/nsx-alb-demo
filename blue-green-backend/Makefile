.PHONY: build run publish

publish: build
	- docker push ghcr.io/yogendra/blue-green-backend:latest

build: 
	- docker build -t ghcr.io/yogendra/blue-green-backend:latest . 

run: build
	- docker run --rm -it -p 3000:8080 ghcr.io/yogendra/blue-green-backend:latest


