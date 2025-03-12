const jwt = require('jsonwebtoken');
const key ="1234";

async function auth(req,res,next)
{
    const token = req.headers.authorization;

    try
    {
        jwt.verify(token,key,(err,decode)=>{
            if(err)
            {
                return res.status(402).json({
                    msg:'token does not match'
                });
            }
            else
            {
                req.email = decode.email;
                next();
                return ;
            }
        })
    }
    catch(err)
    {
        return res.status(402).json({
            msg:'token is missing'
        });
    }
}

module.exports=auth;