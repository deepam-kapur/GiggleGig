import ErrorHelper from "./error.helpers";

const send = (res, payload, code) => {
    let contentType = 'application/json';
    let returnPayload = JSON.stringify(payload);

    if(payload instanceof ErrorHelper){
        payload = payload.get();
        
        code = payload.code;
        delete payload.code;
        
        returnPayload = JSON.stringify(payload);
    } else if(payload instanceof Error){
        contentType = 'text/plain';
        returnPayload = payload.toString();
    } else if(payload instanceof String || typeof payload === 'string'){
        contentType = 'text/plain';
        returnPayload = payload;
    }

    !code && (code = 200);

    res.writeHead(code, { 'Content-Type': contentType, });
    res.send(returnPayload);
};

export default {
    send,
};