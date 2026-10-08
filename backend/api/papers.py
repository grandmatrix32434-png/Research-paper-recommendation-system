from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Request
from models.schemas import Paper, PaperListResponse

router = APIRouter(prefix="/api/papers", tags=["Papers"])


@router.get("", response_model=PaperListResponse)
def get_papers(
    request: Request,
    search: Optional[str] = Query(None, description="Search query matching title, abstract, authors, or keywords"),
    category: Optional[str] = Query(None, description="Filter by research category"),
    year: Optional[int] = Query(None, description="Filter by publication year"),
    limit: Optional[int] = Query(None, ge=1, le=200, description="Maximum papers to return"),
):
    """
    Retrieves research papers from the indexed dataset with optional search, category, year, and limit filters.
    """
    paper_service = request.app.state.paper_service
    papers = paper_service.get_all_papers(search=search, category=category, year=year, limit=limit)
    return PaperListResponse(total=len(papers), papers=papers)


@router.get("/{paper_id}", response_model=Paper)
def get_paper(request: Request, paper_id: str):
    """
    Retrieves complete details for a single research paper by ID.
    """
    paper_service = request.app.state.paper_service
    paper = paper_service.get_paper_by_id(paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail=f"Paper with ID '{paper_id}' not found.")
    return paper


@router.get("/{paper_id}/similar")
def get_similar_papers(request: Request, paper_id: str, limit: int = Query(5, ge=1, le=20)):
    """
    Finds papers with high content similarity to the specified paper.
    """
    paper_service = request.app.state.paper_service
    content_recommender = request.app.state.content_recommender

    if not paper_service.paper_exists(paper_id):
        raise HTTPException(status_code=404, detail=f"Paper with ID '{paper_id}' not found.")

    similar_pairs = content_recommender.get_similar_papers(paper_id=paper_id, top_k=limit)
    results = []
    for pid, score in similar_pairs:
        paper = paper_service.get_paper_by_id(pid)
        if paper:
            results.append({
                "paper": paper,
                "similarity_score": round(score, 4)
            })

    return {"target_paper_id": paper_id, "similar_papers": results}
