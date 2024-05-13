# Priyam Innovations Store Bill

---

Create function in local and send to prod::
`netlify dev`

## Repo Clone

1. git clone URL
2. npm i

## Run Repo Locally

- For client -> npm run client

- For server -> netlify dev

## For deployment

1. Delete functions-build folder
2. Delete build folder
3. Run `netlify build`
4. Verify functions-build and build are recreated
5. Run `netlify deploy --prod`
   > Note -> Install netlify CLI , npm install netlify-cli -g

> Imp note -> use node 16
