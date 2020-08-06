const router = require('express').Router();
const Projects = require('../models/Projects');
const multer = require('multer');
const auth = require('../middlewares/auth');


// projects
var storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'uploads/')
    },

    filename: (req,file,cb) => {
        cb(null, `${Date.now()}_$(file.originalname)`)
    },

    fileFilter: (req,file,cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png' || ext!== '.jpeg') {
            return cb(res.status(400).end('only jpg,png,jpeg are allowed'), false)
        }
        cb(null,true)
    }

})

var upload = multer({ storage: storage }).single("file")


router.post("/uploadImage", auth, (req,res) => {
    console.log(req)

    upload(req,res, err => {
        if(err) {
            return res.json({ success: false, err})
        }
        return res.json({ success: true, image: res.req.file.path, filename: res.req.file.filename })
    })
});


router.post('/uploadProject', auth, (req,res) => {
    const project = new Projects(req.body)

    project.save((err) => {
        if(err) return res.status(400).json({ success: false, err})
        return res.status(200).json({ success:true })
    })
})


router.get('/projects_by_id', (req,res) => {
    let type = req.query.type
    let projectIds = req.query.id

    if (type === "array") {
        let ids = req.query.id.split(',')
        projectIds = [];
        projectIds = ids.map(item => {
            return item
        })
    }




    // we find the prject information that belonsg to the project id

    Projects.find({ '_id': { $in: projectIds }})
    .populate('creator')
    .exec((err, product) => {
        if (err) return res.status(400).send(err)
        return res.status(200).send(projects)
    })
})























module.exports = router