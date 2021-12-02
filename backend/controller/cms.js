const CMS = require('../model/cms')
const FAQ = require('../model/FAQ')

exports.addcms = async (req, res) => {
    try {
        // const {
        //    Name,
        //    description
            
        // } = req.body
        var Name = req.body.Name;
        var content = req.body.Content;
        const newcms = new CMS({
            Name:Name,
            description:content   
        });

        let response = new CMS(newcms)
        response.save()
        .then((result)=>{
            res.json({statusCode:"200",statusMsj:"Successfuly Add CMS", data:result})
        }).catch((err)=>{
            console.log(err);
            return res.send(err);
        })
    } catch (error) {
        console.log(error);
        return res.send(error);
    }
}

