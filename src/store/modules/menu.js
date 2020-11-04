import { parentListMenu } from '@/api/system/menu'
const menu = {
    state: {
        parentListMenu: [],
    },

    mutations: {
        SET_PARENT_LIST_MENU: (state, parentListMenu) => {
            state.parentListMenu = parentListMenu;
        },
    },

    actions: {
        getParentListMenu({ commit }) {
            return new Promise(resolve => {
                parentListMenu().then(
                    res => {
                        commit("SET_PARENT_LIST_MENU", res.data)
                        resolve()
                    }
                );
            });
        },
    }
}

export default menu
