const Post = require("../models/post");
const image = require("../services/image");

function createPost(req, res) {
  const post = new Post(req.body);
  post.created_at = new Date();

  const imagePath = image.getFilePath(req.files.miniature);
  post.miniature = imagePath;

  post.save((err, postStored) => {
    if (err) {
      res.status(400).send({ message: "Error al crear el post." });
    } else {
      res.status(200).send(postStored);
    }
  });
}

function getPosts(req, res) {
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { created_at: "desc" },
  };

  Post.paginate({}, options, (err, postsStored) => {
    if (err) {
      res.status(400).send({ message: "Error al obtener los posts." });
    } else {
      res.status(200).send(postsStored);
    }
  });
}

function updatePost(req, res) {
  const { id } = req.params;
  const postData = req.body;

  if (req.files.miniature) {
    const imagePath = image.getFilePath(req.files.miniature);
    postData.miniature = imagePath;
  }

  Post.findByIdAndUpdate({ _id: id }, postData, (err) => {
    if (err) {
      res.status(400).send({ message: "Error al actualizar el post." });
    } else {
      res.status(200).send({ message: "Post actualizado." });
    }
  });
}

function deletePost(req, res) {
  const { id } = req.params;

  Post.findByIdAndDelete(id, (err) => {
    if (err) {
      res.status(400).send({ message: "Error al eliminar el post." });
    } else {
      res.status(200).send({ message: "Post eliminado." });
    }
  });
}

function getPost(req, res) {
  const { path } = req.params;

  Post.findOne({ path }, (err, postStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else if (!postStored) {
      res.status(400).send({ message: "No se ha encontrado ningún post." });
    } else {
      res.status(200).send(postStored);
    }
  });
}

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPost,
};
