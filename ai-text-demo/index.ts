import {streamText} from "ai";
import 'dotenv/config'

async function main(){
    const result = streamText({
      model: "amazon/nova-lite",
      prompt: "Invent a holiday and describe its traditions ",
    });
    

    for await (const textPart of result.textStream){
       process.stdout.write(textPart);
    }

    console.log();
    console.log('Token Usage:' , await result.usage);
    console.log('Finish Reason' , await result.finishReason)
}

main().catch(console.error)


