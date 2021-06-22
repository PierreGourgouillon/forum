
export let objectCommentary = {
    image : "",
    pseudo: "",
    message: "",
}

export const templateCommentary = (objectCommentary)=>{
    return `
         <div class="globalFLex" style="cursor: default">
                    <div class="globalFLex paddingLeft border">
                        <div class="RowFlex" style="padding-top: 10px;width: 100%">
                            <div class="globalFLex">
                                <div class="globalFLex" style="width: 40px;border-radius: 999px;align-items: center">
                                    <img src="data:image/png;base64,${objectCommentary.image}" style="border-radius: 999px; width: 90%">
                                </div>
                            </div>

                            <div class="globalFLex" style="margin-left: 10px; width: 95%">
                                <div class="globalFLex" style="margin-top: 8px">
                                    <span id="pseudo-commentary">${objectCommentary.pseudo}</span>
                                </div>

                                <div class="globalFLex" style="width: 100%">
                                    <p id="message-commentary">${objectCommentary.message}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
`
}
