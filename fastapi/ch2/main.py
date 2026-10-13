from fastapi import FastAPI,Query,HTTPException
from datas import menu
from models import MenueResponse,MenueItems
app = FastAPI(
    title="Mene backend"
)

@app.get("/menue",response_model=MenueResponse)
def get_menue(category:str | None = Query(None,description="Query ctaehori")):
    print("category is ",category)
    if category :
        filtered = [item for item in menu if item["category"].lower() == category.lower()]

        if not filtered :
            raise HTTPException(status_code=404,detail="Not found")
        
        return MenueResponse(status=200,count=len(filtered),items=filtered)

    else:
        return  MenueResponse(status=200,count=len(menu),items=menu)



@app.get("/menue/{id}",response_model=MenueItems)
def getOne(id:int):
    print("id is",id)
    for item in menu :
        if(item["id"]==int(id)):
            return item
    raise HTTPException(status_code=404,detail=f"Not found the id {id} ")


