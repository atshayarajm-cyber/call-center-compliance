from pydantic import BaseModel
from fastapi import APIRouter, Depends

from app.api.deps import require_admin
from app.models.user import User
from app.services.sop_validator import DEFAULT_SOP_TEMPLATE

router = APIRouter(prefix="/admin", tags=["admin"])


class SopTemplateResponse(BaseModel):
    template: dict


@router.get("/sop-template", response_model=SopTemplateResponse)
def get_sop_template(_: User = Depends(require_admin)) -> SopTemplateResponse:
    return SopTemplateResponse(template=DEFAULT_SOP_TEMPLATE)
