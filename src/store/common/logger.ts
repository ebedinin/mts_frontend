export const reducer_log = (funcname: string, param: any, error = null as any, message="")=>{
    if(error){
        if (error.response){
            if(error.response.status){
                responsestatus(funcname, error.response.status, param, message);
            }
            else {
                log(funcname, param, message);
            }
        }
        else{
            responsenull(funcname, param, message);
        }
    }
    else {
        log(funcname, param, message);
    }
};

const log = (funcname: string, param: any, message: any)=>{
    alert(`${funcname}(${JSON.stringify(param)}); MESSAGE = "${message}"`);
};
const responsenull = (funcname: string, param: any, message: string)=>{
    let messsage_str = message === ""? message:`MESSAGE =${message}`;
    alert(`${funcname}(${JSON.stringify(param)}); response = null; ${messsage_str}`);
};

const responsestatus = (funcname: string, status:number, param:any, message:string)=>{
    let messsage_str = message === ""? message:`MESSAGE =${message}`;
    alert(`${funcname}(${JSON.stringify(param)}); response.status = ${status}; ${messsage_str}`);
};