# FreeCodeCamp API Basejump: URL Shortener Microservice
## User stories:

- I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
- When I visit that shortened URL, it will redirect me to my original link.

## Example creation usage:
`https://glacial-peak-36532.herokuapp.com/new/https://www.google.com`

`https://glacial-peak-36532.herokuapp.com/new/http://foo.com:80`

## Example creation output
`{ "original_url":"http://foo.com:80", "short_url":"https://glacial-peak-36532.herokuapp.com/8170" }`

## Usage:
`https://glacial-peak-36532.herokuapp.com/2871`

## Will redirect to:
`https://www.google.com/`
