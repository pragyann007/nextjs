from pydantic import BaseModel

class MenueItems(BaseModel) :
    id:int
    name:str
    description:str
    category:str
    price:float
    isAvailable:bool

class MenueResponse(BaseModel):
    status:int
    count:int
    items:list[MenueItems]
