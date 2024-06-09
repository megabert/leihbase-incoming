/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("h7plyphsy0mgjpf")

  collection.listRule = "user = @request.auth.id || (@collection.location.id ?= location && @collection.location.users ?~ @request.auth.id)"
  collection.viewRule = "user = @request.auth.id || (@collection.location.id ?= location && @collection.location.users ?~ @request.auth.id)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("h7plyphsy0mgjpf")

  collection.listRule = "@request.auth.id = user"
  collection.viewRule = null

  return dao.saveCollection(collection)
})
