from pydantic import BaseModel

class RatingCreate(BaseModel):
    post_id: int
    user_id: int
    rating: int  # Entre 1 y 5

class TagCreate(BaseModel):
    name: str

class TagResponse(TagCreate):
    id: int

    class Config:
        orm_mode = True