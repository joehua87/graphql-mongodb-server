# Mongo Graphql Server

## TODO
* Allow to filter by reference field. Example:
Given:
```
const product = {
  id: 1,
  name: 'Blue Tshirt',
  tags: [1, 2, 3],
}

const tag = {
  id: 1,
  slug: 'cheap-tshirt'
}
```
We want to query products with tag = 'cheap-tshirt'

* Support Authorization
* Allow mongoose populate
