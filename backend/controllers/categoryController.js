const Category = require("../models/Category");


module.exports.addCategory = async (req,res) => {
try{
    const category = new Category({
        name: req.body.name,
        description: req.body.description
      });

    await category.save();

    res.json({ message: 'category created'});
}catch(error){
    console.error(error);
    res.status(500).json({message: "internal server error"})
}
}


exports.getAllCategory = async (req,res) => {
    try{
        const categories = await Category.find();
        res.json(categories);
    }catch(error){

        console.error(error);
        res.status(500).json({message: "internal server error"});
    }
}

//update category
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(id, { name, description}, {new: true});
    res.json(category);

};

//delete 
exports.deleteCategory = async(req, res) => {

    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message : 'category delted'})

};


exports.getById = async(req, res) => {
    const{ id } = req.params;
    const category = await Category.findById(id);
    res.json(category);
};



