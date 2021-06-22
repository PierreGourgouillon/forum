export let objectPopUp = {
    pseudoAuthor: "",
    imageAuthor : "",
    imageUser: "",
    messagePost: "",
}

export const templatepopUp = (objectPopUp)=>{
    return `
    <div class="container-popUp-update">
        <div class="block-popUp-update">
            <div class="globalFLex">
                <div class="RowFlex" id="bandeau" style="padding-top: 5px;padding-bottom: 5px; align-items: baseline">
                    <div class="RowFlex title-popUp" style="flex-basis: 92%; justify-content: center"><span style="padding-left: 25px">Commentaire</span></div>
                    <div class="RowFlex" id="image-close"><img src="/static/Design/Images/icon/close.svg"></div>
                </div>

                <div class="globalFLex" style="justify-content: center;align-items: center;margin-top: 10px; cursor: default">
                    <div class="globalFLex" style="width: 100%;">
                        <div class="globalFLex paddingLeft">
                            <div class="RowFlex" style="width: 100%">
                                <div class="globalFLex" style="width: 48px;">
                                    <img style="width: 90%; border-radius: 999px" src="data:image/png;base64,${objectPopUp.imageAuthor}">
                                </div>
                                <div class="globalFLex" style="padding-top: 10px;margin-left: 10px;width: 80%">
                                    <div class="globalFLex">
                                        <span id="pseudoPost">${objectPopUp.pseudoAuthor}</span>
                                    </div>
                                    <div class="globalFLex" style="width: 100%;margin-top: 10px">
                                        <div id="message" style="display: inline-block">${objectPopUp.messagePost}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="globalFLex paddingLeft" style="margin-top: 10px">
                            <div class="RowFlex">
                                <div class="globalFLex" style="width: 48px;">
                                    <img style="width: 90%; border-radius: 999px" src="data:image/png;base64,${objectPopUp.imageUser}">
                                </div>
                                <div style="margin-left: 10px">
                                    <textarea placeholder="Ecrivez votre commentaire" class="valideBorder" id="message-Comment"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="globalFLex" style="width: 100%; align-items: flex-end">
                    <div class="globalFLex" style="padding-right: 15px;padding-top: 5px" >
                        <div class="styleButton" id="sendCommentary">
                            Envoyer
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
`
}
