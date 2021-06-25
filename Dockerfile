FROM golang
LABEL name="Pioutter"
LABEL description="Projet Forum YNOV Lyon 20-21"
LABEL authors="Pierre Gourgouillon, Lucas Barthélémy, Thomas Gaulé, Arthur Paturel, Sebastian Alonso"
RUN mkdir /Pioutter
ADD . /Pioutter
WORKDIR /Pioutter
COPY go.mod go.sum ./
RUN go mod download
RUN go build -o main .
EXPOSE 8088
CMD ["/Pioutter/main"]