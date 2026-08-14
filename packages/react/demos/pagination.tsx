import { useMemo, useState } from 'react'
import Story from '../../components/story/Story'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@react-registry/pagination'

// reka-ui's PaginationRoot owns the page-window/ellipsis logic and exposes it
// via slot props. The React (radix-style) port ships the parts presentational
// only, so the caller computes the page window. This helper mirrors reka-ui's
// output: a list of { type: 'page', value } | { type: 'ellipsis' } items with
// optional first/last edge pages.
type PageItem = { type: 'page'; value: number } | { type: 'ellipsis' }

function usePageItems(page: number, total: number, itemsPerPage: number, siblingCount: number, showEdges: boolean) {
  return useMemo<PageItem[]>(() => {
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage))
    const items: PageItem[] = []
    const start = Math.max(showEdges ? 2 : 1, page - siblingCount)
    const end = Math.min(showEdges ? totalPages - 1 : totalPages, page + siblingCount)

    if (showEdges) {
      items.push({ type: 'page', value: 1 })
      if (start > 2) items.push({ type: 'ellipsis' })
    } else if (start > 1) {
      items.push({ type: 'ellipsis' })
    }

    for (let p = start; p <= end; p++) items.push({ type: 'page', value: p })

    if (showEdges) {
      if (end < totalPages - 1) items.push({ type: 'ellipsis' })
      if (totalPages > 1) items.push({ type: 'page', value: totalPages })
    } else if (end < totalPages) {
      items.push({ type: 'ellipsis' })
    }

    return items
  }, [page, total, itemsPerPage, siblingCount, showEdges])
}

const btnBase =
  'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'

function pageBtnClass(active: boolean) {
  return active ? `${btnBase} bg-primary text-primary-foreground border-primary` : `${btnBase} hover:bg-accent`
}

const navBtnClass = `${btnBase} hover:bg-accent`

export default function PaginationDemo() {
  const [defaultPage, setDefaultPage] = useState(3)
  const [compactPage, setCompactPage] = useState(10)
  const [noEdgePage, setNoEdgePage] = useState(5)
  const [boundaryPage, setBoundaryPage] = useState(25)
  const [page, setPage] = useState(3)
  const disabledPage = 3

  const defaultItems = usePageItems(defaultPage, 100, 10, 1, true)
  const compactItems = usePageItems(compactPage, 200, 10, 0, true)
  const noEdgeItems = usePageItems(noEdgePage, 100, 10, 1, false)
  const boundaryItems = usePageItems(boundaryPage, 500, 10, 1, true)
  const modelItems = usePageItems(page, 1000, 10, 1, true)
  const disabledItems = usePageItems(disabledPage, 100, 10, 1, true)

  return (
    <>
      <Story
        title="Default"
        description="Pagination with prev/next, edge pages, ellipses, and an active page indicator."
      >
        <Pagination>
          <PaginationList className="flex items-center gap-1">
            <PaginationListItem>
              <PaginationFirst className={navBtnClass} onClick={() => setDefaultPage(1)} />
            </PaginationListItem>
            <PaginationListItem>
              <PaginationPrev className={navBtnClass} onClick={() => setDefaultPage((p) => Math.max(1, p - 1))} />
            </PaginationListItem>
            {defaultItems.map((item, index) =>
              item.type === 'page' ? (
                <PaginationListItem key={index}>
                  <button
                    type="button"
                    aria-label={`Go to page ${item.value}`}
                    aria-current={item.value === defaultPage ? 'page' : undefined}
                    className={pageBtnClass(item.value === defaultPage)}
                    onClick={() => setDefaultPage(item.value)}
                  >
                    {item.value}
                  </button>
                </PaginationListItem>
              ) : (
                <PaginationListItem key={index}>
                  <PaginationEllipsis className="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm">
                    …
                  </PaginationEllipsis>
                </PaginationListItem>
              ),
            )}
            <PaginationListItem>
              <PaginationNext className={navBtnClass} onClick={() => setDefaultPage((p) => Math.min(10, p + 1))} />
            </PaginationListItem>
            <PaginationListItem>
              <PaginationLast className={navBtnClass} onClick={() => setDefaultPage(10)} />
            </PaginationListItem>
          </PaginationList>
        </Pagination>
      </Story>

      <Story
        title="Compact (no siblings)"
        description="sibling-count=0 keeps only the current page between ellipses for a tighter footprint."
      >
        <Pagination>
          <PaginationList className="flex items-center gap-1">
            <PaginationListItem>
              <PaginationPrev className={navBtnClass} onClick={() => setCompactPage((p) => Math.max(1, p - 1))} />
            </PaginationListItem>
            {compactItems.map((item, index) =>
              item.type === 'page' ? (
                <PaginationListItem key={index}>
                  <button
                    type="button"
                    aria-label={`Go to page ${item.value}`}
                    aria-current={item.value === compactPage ? 'page' : undefined}
                    className={pageBtnClass(item.value === compactPage)}
                    onClick={() => setCompactPage(item.value)}
                  >
                    {item.value}
                  </button>
                </PaginationListItem>
              ) : (
                <PaginationListItem key={index}>
                  <PaginationEllipsis className="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm">
                    …
                  </PaginationEllipsis>
                </PaginationListItem>
              ),
            )}
            <PaginationListItem>
              <PaginationNext className={navBtnClass} onClick={() => setCompactPage((p) => Math.min(20, p + 1))} />
            </PaginationListItem>
          </PaginationList>
        </Pagination>
      </Story>

      <Story
        title="Without first/last edges"
        description="Drop PaginationFirst and PaginationLast when only ±1 navigation is needed."
      >
        <Pagination>
          <PaginationList className="flex items-center gap-1">
            <PaginationListItem>
              <PaginationPrev className={navBtnClass} onClick={() => setNoEdgePage((p) => Math.max(1, p - 1))} />
            </PaginationListItem>
            {noEdgeItems.map((item, index) =>
              item.type === 'page' ? (
                <PaginationListItem key={index}>
                  <button
                    type="button"
                    aria-label={`Go to page ${item.value}`}
                    aria-current={item.value === noEdgePage ? 'page' : undefined}
                    className={pageBtnClass(item.value === noEdgePage)}
                    onClick={() => setNoEdgePage(item.value)}
                  >
                    {item.value}
                  </button>
                </PaginationListItem>
              ) : (
                <PaginationListItem key={index}>
                  <PaginationEllipsis className="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm">
                    …
                  </PaginationEllipsis>
                </PaginationListItem>
              ),
            )}
            <PaginationListItem>
              <PaginationNext className={navBtnClass} onClick={() => setNoEdgePage((p) => Math.min(10, p + 1))} />
            </PaginationListItem>
          </PaginationList>
        </Pagination>
      </Story>

      <Story
        title="With edges (boundary 1)"
        description="show-edges keeps the first and last page visible regardless of the current selection."
      >
        <Pagination>
          <PaginationList className="flex flex-wrap items-center gap-1">
            <PaginationListItem>
              <PaginationPrev className={navBtnClass} onClick={() => setBoundaryPage((p) => Math.max(1, p - 1))} />
            </PaginationListItem>
            {boundaryItems.map((item, index) =>
              item.type === 'page' ? (
                <PaginationListItem key={index}>
                  <button
                    type="button"
                    aria-label={`Go to page ${item.value}`}
                    aria-current={item.value === boundaryPage ? 'page' : undefined}
                    className={pageBtnClass(item.value === boundaryPage)}
                    onClick={() => setBoundaryPage(item.value)}
                  >
                    {item.value}
                  </button>
                </PaginationListItem>
              ) : (
                <PaginationListItem key={index}>
                  <PaginationEllipsis className="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm">
                    …
                  </PaginationEllipsis>
                </PaginationListItem>
              ),
            )}
            <PaginationListItem>
              <PaginationNext className={navBtnClass} onClick={() => setBoundaryPage((p) => Math.min(50, p + 1))} />
            </PaginationListItem>
          </PaginationList>
        </Pagination>
      </Story>

      <Story
        title="Many pages with v-model"
        description="Two-way bind v-model:page to react to page changes outside the component."
      >
        <div className="space-y-3">
          <Pagination>
            <PaginationList className="flex flex-wrap items-center gap-1">
              <PaginationListItem>
                <PaginationFirst className={navBtnClass} onClick={() => setPage(1)} />
              </PaginationListItem>
              <PaginationListItem>
                <PaginationPrev className={navBtnClass} onClick={() => setPage((p) => Math.max(1, p - 1))} />
              </PaginationListItem>
              {modelItems.map((item, index) =>
                item.type === 'page' ? (
                  <PaginationListItem key={index}>
                    <button
                      type="button"
                      aria-label={`Go to page ${item.value}`}
                      aria-current={item.value === page ? 'page' : undefined}
                      className={pageBtnClass(item.value === page)}
                      onClick={() => setPage(item.value)}
                    >
                      {item.value}
                    </button>
                  </PaginationListItem>
                ) : (
                  <PaginationListItem key={index}>
                    <PaginationEllipsis className="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm">
                      …
                    </PaginationEllipsis>
                  </PaginationListItem>
                ),
              )}
              <PaginationListItem>
                <PaginationNext className={navBtnClass} onClick={() => setPage((p) => Math.min(100, p + 1))} />
              </PaginationListItem>
              <PaginationListItem>
                <PaginationLast className={navBtnClass} onClick={() => setPage(100)} />
              </PaginationListItem>
            </PaginationList>
          </Pagination>
          <p className="text-muted-foreground text-xs">Page {page} of 100</p>
        </div>
      </Story>

      <Story
        title="Disabled"
        description="Setting :disabled on Pagination greys out every control and blocks navigation."
      >
        <Pagination>
          <PaginationList className="flex items-center gap-1 opacity-50">
            <PaginationListItem>
              <PaginationFirst disabled className={navBtnClass} />
            </PaginationListItem>
            <PaginationListItem>
              <PaginationPrev disabled className={navBtnClass} />
            </PaginationListItem>
            {disabledItems.map((item, index) =>
              item.type === 'page' ? (
                <PaginationListItem key={index}>
                  <button
                    type="button"
                    disabled
                    aria-label={`Go to page ${item.value}`}
                    aria-current={item.value === disabledPage ? 'page' : undefined}
                    className={pageBtnClass(item.value === disabledPage)}
                  >
                    {item.value}
                  </button>
                </PaginationListItem>
              ) : (
                <PaginationListItem key={index}>
                  <PaginationEllipsis className="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm">
                    …
                  </PaginationEllipsis>
                </PaginationListItem>
              ),
            )}
            <PaginationListItem>
              <PaginationNext disabled className={navBtnClass} />
            </PaginationListItem>
            <PaginationListItem>
              <PaginationLast disabled className={navBtnClass} />
            </PaginationListItem>
          </PaginationList>
        </Pagination>
      </Story>
    </>
  )
}
