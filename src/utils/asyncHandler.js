 const asyncHandler = (requesthandler)=>{ 
    return (req, res, next) =>{
        Promise.resolve( requesthandler(req,res,next)).catch((err)=>{
            next(err)
        })


 }

}

export {asyncHandler}
// cosnt asynchandler = ()=>{} normal callback function
// const aysnchandler = ()=> {()=>{}} this is nest callback in which we pass fun as ParameterDecorator
// const asynchandler = () =>() =>{ } this is high order function after removing {}

// const asynchandler =( fn)=> async(req, res, next)=>{
//     try {

//         await fn(res, req, next)
        
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
        
//     }

// }   this is try and catch method