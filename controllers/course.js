const Course = require("../models/course");
const image = require("../services/image");

async function createCourse(req, res) {
  const course = new Course(req.body);

  if (req.files.miniature) {
    const imagePath = image.getFilePath(req.files.miniature);
    course.miniature = imagePath;
  }

  course.save((err, courseStored) => {
    if (err) {
      res.status(400).send({ message: "Error al crear curso." });
    } else {
      res.status(200).send(courseStored);
    }
  });
}

function getCourse(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  Course.paginate({}, options, (err, courses) => {
    if (err) {
      res.status(400).send({ message: "Error al obtener los cursos." });
    } else {
      res.status(200).send(courses);
    }
  });
}

function updateCourse(req, res) {
  const { id } = req.params;
  const courseData = req.body;

  if (req.files.miniature) {
    const imagePath = image.getFilePath(req.files.miniature);
    courseData.miniature = imagePath;
  }

  Course.findByIdAndUpdate({ _id: id }, courseData, (err) => {
    if (err) {
      res.status(400).send({ message: "Error al actualizar el curso." });
    } else {
      res.status(200).send({ message: "Curso actualizado correctamente." });
    }
  });
}

function deleteCourse(req, res) {
  const { id } = req.params;

  Course.findByIdAndDelete(id, (err) => {
    if (err) {
      res.status(400).send({ message: "Error al eliminar curso." });
    } else {
      res.status(200).send({ message: "Curso eliminado correctamente." });
    }
  });
}

module.exports = {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
};
