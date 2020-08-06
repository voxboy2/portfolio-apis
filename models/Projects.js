const mongoose =  require('mongoose');

const Schema = mongoose.Schema;

const ProjectSchema = mongoose.Schema ({

    creator : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    // refrencing the user
    },

    project_title : {
        type: String,
        required: true,
        min: 3,
        max: 255
    },

    project_image : {
        type: Array,
        required: [],
    },


    Project_description : {
        type: String,
        required: true,
    }
},

  {timestamps: true})

module.exports = mongoose.model('Projects', ProjectSchema)

