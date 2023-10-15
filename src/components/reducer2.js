export const initialState2 = false;

const reducer2 = (state, action) => {
    if(action.type === "USER"){
        return action.payload;
    }
    return state;
}
export {reducer2}