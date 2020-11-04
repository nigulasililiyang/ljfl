const maintain = {
    state: {
        picAttachmentId:'',
    },

    mutations: {
        SET_PIC_ID: (state, picAttachmentId) => {
            state.picAttachmentId = picAttachmentId;
        },
    },

    actions: {
        SetPictureId({ commit },data) {
            commit("SET_PIC_ID",data)
          
        },
    }
}

export default maintain
