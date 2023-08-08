const express = require("express");
const { Post } = require("../model/post");
const Joi = require("joi");
const bodyParser = require("body-parser");

const router = express.Router();

router.post("/createPost", bodyParser.json(), async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(200).required(),
        content: Joi.string().min(20).required(),
        author: Joi.string().required()
    });


    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send({
            responseCode: "96",
            responseMessage: error.details[0].message,
            data: null,
        });
    }

    const { title, content, author } = req.body

    try {
        let post = await Post.findOne({title})
        post = new Post({
            title,
            author,
            content,
            dateCreated: new Date().toJSON()
        });

        await post.save()

        res.status(200).send({
            responseCode: "00",
            responseMessage: "Post created successfully",
            data: post,
        });

    } catch (error) {
        res.status(400).send({
            responseCode: "86",
            responseMessage: "Internal server error",
            data: null,
        });
        console.log(error)
    }
});

router.get("/getAllPosts", async(req, res) => {
    try {
       const post = await Post.find(); 
       res.status(200).send({
         responseCode: "00",
         responseMessage: "Post fetched successfully",
         data: post
      })  
    } catch (error) {
      res.status(500).send({
        responseCode: "96",
        responseMessage: "Internal server error",
        data: null
      })  
    }
})

router.put("/updatePostById", bodyParser.json(), async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(200).required(),
        content: Joi.string().min(20).required(),
        author: Joi.string().required(),
        _id: Joi.string()
    });


    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send({
            responseCode: "96",
            responseMessage: error.details[0].message,
            data: null,
        });
    }

    const {_id, title, content, author } = req.body


    try {
        let post = Post.findOneAndUpdate({_id })
        if (!post) {
           return res.status(400).send({
                responseCode: "96",
                responseMessage: "No post found!",
                data: null,
            });
        } else {
            post = {title, content, author, _id, dateUpdated: new Date().toJSON()}
            await post.save()
            return res.status(200).send({
                responseCode: "00",
                responseMessage: "Post updated successfully",
                data: post,
            });
        }
    } catch (error) {
        res.status(500).send({
            responseCode: "96",
            responseMessage: "Internal server error",
            data: null
          });  
    }
})

module.exports.router = router