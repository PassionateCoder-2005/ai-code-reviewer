import { interaction } from "../services/ai.service.js";

export const aiRes=async (req,res) => {
    try {
        const code=req.body.code;
    if(!code){
        return res.status(404).json({
            message:"Code not found"
        })
    }
    const response=await interaction(code);
    return res.status(200).json({
        message:"Your code after review",
        response
    })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Internal server error",
        })
    }

}