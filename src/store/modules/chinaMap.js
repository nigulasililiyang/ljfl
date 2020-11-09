const chinaMap = {
    state: {
        level:'country',
        currentArea: "全国",
        currentAdcode: 100000,
        geoJson: {},
    },

    mutations: {
        SET_CURRENT_MAP: (state, properties) => {
            state.level = properties.level;
            state.currentArea = properties.name;
            state.currentAdcode = properties.adcode;
            state.geoJson=properties.geoJson;
        },
    },

    actions: {
        SetCurrentMap({ commit },properties) {
            console.log("SetCurrentMap",properties);
            commit("SET_CURRENT_MAP",properties)  
        },
    }
}

export default chinaMap;
