import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "../button"
import { dayjs } from "../../const"
import { LazyDiv } from "../lazyDiv"
import { useModal } from "../modal"
import offlineGuestBook from "./offlineGuestBook.json"
import { SERVER_URL, STATIC_ONLY } from "../../env"

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  limit,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../store/firebase";

const RULES = {
  name: {
    maxLength: 10,
  },
  content: {
    maxLength: 100,
  },
  password: {
    minLength: 4,
    maxLength: 20,
  },
}

const PAGES_PER_BLOCK = 5
const POSTS_PER_PAGE = 5

type Post = {
  id: number
  timestamp: number
  name: string
  content: string
}

export const GuestBook = () => {
  const { openModal, closeModal } = useModal()

  const [posts, setPosts] = useState<Post[]>([])

  const loadPosts = async () => {
  const q = query(
      collection(db, "guestbook"),
      orderBy("timestamp", "desc"),
      limit(3)
    );

    const snapshot = await getDocs(q);

    const loadedPosts = snapshot.docs.map(doc => ({
      id: doc.id as unknown as number,
      ...doc.data()
    })) as Post[];

    setPosts(loadedPosts);
  };

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <LazyDiv className="card guestbook">
      <h2 className="english">Guest Book</h2>

      <div className="break" />

      {posts.map((post) => (
        <div key={post.id} className="post">
          <div className="heading">
            {/* <button
              className="close-button"
              onClick={async () => {
                if (SERVER_URL) {
                  openModal({
                    className: "delete-guestbook-modal",
                    closeOnClickBackground: false,
                    header: <div className="title">삭제하시겠습니까?</div>,
                    content: (
                      <DeleteGuestBookModal
                        postId={post.id}
                        onSuccess={() => {
                          loadPosts()
                        }}
                      />
                    ),
                    footer: (
                      <>
                        <Button
                          buttonStyle="style2"
                          type="submit"
                          form="guestbook-delete-form"
                        >
                          삭제하기
                        </Button>
                        <Button
                          buttonStyle="style2"
                          className="bg-light-grey-color text-dark-color"
                          onClick={closeModal}
                        >
                          닫기
                        </Button>
                      </>
                    ),
                  })
                }
              }}
            /> */}
          </div>
          <div className="body">
            <div className="title">
              <div className="name">{post.name}</div>
              <div className="date">
                {dayjs.unix(post.timestamp).format("YYYY-MM-DD")}
              </div>
            </div>
            <div className="content">{post.content}</div>
          </div>
        </div>
      ))}

      <div className="break" />

      {SERVER_URL && (
        <>
          <Button
            onClick={() =>
              openModal({
                className: "write-guestbook-modal",
                closeOnClickBackground: false,
                header: (
                  <div className="title-group">
                    <div className="title">방명록 작성하기</div>
                    <div className="subtitle">
                      신랑, 신부에게 축하의 마음을 전해주세요.
                    </div>
                  </div>
                ),
                content: <WriteGuestBookModal loadPosts={loadPosts} />,
                footer: (
                  <>
                    <Button
                      buttonStyle="style2"
                      type="submit"
                      form="guestbook-write-form"
                    >
                      저장하기
                    </Button>
                    <Button
                      buttonStyle="style2"
                      className="bg-light-grey-color text-dark-color"
                      onClick={closeModal}
                    >
                      닫기
                    </Button>
                  </>
                ),
              })
            }
          >
            방명록 작성하기
          </Button>
          <div className="break" />
        </>
      )}

      <Button
        onClick={() =>
          openModal({
            className: "all-guestbook-modal",
            closeOnClickBackground: true,
            header: <div className="title">방명록 전체보기</div>,
            content: <AllGuestBookModal loadPosts={loadPosts} />,
            footer: (
              <Button
                buttonStyle="style2"
                className="bg-light-grey-color text-dark-color"
                onClick={closeModal}
              >
                닫기
              </Button>
            ),
          })
        }
      >
        방명록 전체보기
      </Button>
    </LazyDiv>
  )
}

const WriteGuestBookModal = ({ loadPosts }: { loadPosts: () => void }) => {
  const inputRef = useRef({}) as React.RefObject<{
    name: HTMLInputElement
    content: HTMLTextAreaElement
    password: HTMLInputElement
  }>
  const { closeModal } = useModal()
  const [loading, setLoading] = useState(false)

  return (
    <form
      id="guestbook-write-form"
      className="form"
      onSubmit={async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
          const name = inputRef.current.name.value.trim()
          const content = inputRef.current.content.value.trim()
          // const password = inputRef.current.password.value

          if (!name) {
            alert("이름을 입력해주세요.")
            return
          }
          if (name.length > RULES.name.maxLength) {
            alert(`이름을 ${RULES.name.maxLength}자 이하로 입력해주세요.`)
            return
          }

          if (!content) {
            alert("내용을 입력해주세요.")
            return
          }
          if (content.length > RULES.content.maxLength) {
            alert(`내용을 ${RULES.content.maxLength}자 이하로 입력해주세요.`)
            return
          }

          // if (password.length < RULES.password.minLength) {
          //   alert(`비밀번호를 ${RULES.password.minLength}자 이상 입력해주세요.`)
          //   return
          // }
          // if (password.length > RULES.password.maxLength) {
          //   alert(
          //     `비밀번호를 ${RULES.password.maxLength}자 이하로 입력해주세요.`,
          //   )
          //   return
          // }

          await addDoc(collection(db, "guestbook"), {
            name,
            content,
            timestamp: Math.floor(Date.now() / 1000)
          });

          alert("방명록 작성이 완료되었습니다.")
          closeModal()
          loadPosts()
        } catch {
          alert("방명록 작성에 실패했습니다.")
        } finally {
          setLoading(false)
        }
      }}
    >
      이름
      <input
        disabled={loading}
        type="text"
        placeholder="이름을 입력해주세요."
        className="name"
        ref={(ref) => {
          inputRef.current.name = ref as HTMLInputElement
        }}
        maxLength={RULES.name.maxLength}
      />
      내용
      <textarea
        disabled={loading}
        placeholder="축하 메세지를 100자 이내로 입력해주세요."
        className="content"
        ref={(ref) => {
          inputRef.current.content = ref as HTMLTextAreaElement
        }}
        maxLength={RULES.content.maxLength}
      />
      {/* 비밀번호
      <input
        disabled={loading}
        type="password"
        placeholder="비밀번호를 입력해주세요."
        className="password"
        ref={(ref) => {
          inputRef.current.password = ref as HTMLInputElement
        }}
        maxLength={RULES.password.maxLength}
      /> */}
    </form>
  )
}

const loadAllPosts = async () => {
  const q = query(
    collection(db, "guestbook"),
    orderBy("timestamp", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id as unknown as number,
    ...doc.data()
  })) as Post[];
};

const AllGuestBookModal = ({
  loadPosts,
}: {
  loadPosts: () => Promise<void>
}) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const { openModal, closeModal } = useModal()

  const loadPage = async (page: number) => {
    setCurrentPage(page)
    if (STATIC_ONLY) {
      setCurrentPage(page)

      setPosts(
        offlineGuestBook.slice(
          page * POSTS_PER_PAGE,
          (page + 1) * POSTS_PER_PAGE,
        ),
      )
      setTotalPages(Math.ceil(offlineGuestBook.length / POSTS_PER_PAGE))
    } else {
      try {
        const all = await loadAllPosts();
        const start = page * POSTS_PER_PAGE;
        const end = start + POSTS_PER_PAGE;
        
        setPosts(all.slice(start, end));
        setTotalPages(Math.ceil(all.length / POSTS_PER_PAGE));
        setCurrentPage(page);
      } catch (error) {
        console.error("Error loading posts:", error)
      }
    }
  }

  useEffect(() => {
    loadPage(0)
  }, [])

  const pages = useMemo(() => {
    const start = Math.floor(currentPage / PAGES_PER_BLOCK) * PAGES_PER_BLOCK
    const end = Math.min(start + PAGES_PER_BLOCK, totalPages)

    return Array.from({ length: end - start }).map((_, index) => index + start)
  }, [currentPage, totalPages])

  return (
    <>
      {posts.map((post) => (
        <div key={post.id} className="post">
          <div className="heading">
            <div
              className="close-button"
              onClick={async () => {
                if (SERVER_URL) {
                  openModal({
                    className: "delete-guestbook-modal",
                    closeOnClickBackground: false,
                    header: <div className="title">삭제하시겠습니까?</div>,
                    content: (
                      <DeleteGuestBookModal
                        postId={post.id}
                        onSuccess={() => {
                          loadPosts()
                          loadPage(currentPage)
                        }}
                      />
                    ),
                    footer: (
                      <>
                        <Button
                          buttonStyle="style2"
                          type="submit"
                          form="guestbook-delete-form"
                        >
                          삭제하기
                        </Button>
                        <Button
                          buttonStyle="style2"
                          className="bg-light-grey-color text-dark-color"
                          onClick={closeModal}
                        >
                          닫기
                        </Button>
                      </>
                    ),
                  })
                }
              }}
            />
          </div>
          <div className="body">
            <div className="title">
              <div className="name">{post.name}</div>
              <div className="date">
                {dayjs.unix(post.timestamp).format("YYYY-MM-DD")}
              </div>
            </div>
            <div className="content">{post.content}</div>
          </div>
        </div>
      ))}

      <div className="break" />

      <div className="pagination">
        {pages[0] > 0 && (
          <div
            className="page"
            onClick={() => {
              loadPage(pages[0] - 1)
            }}
          >
            이전
          </div>
        )}
        {pages.map((page) => (
          <div
            className={`page${page === currentPage ? " current" : ""}`}
            key={page}
            onClick={() => {
              if (page === currentPage) return
              loadPage(page)
            }}
          >
            {page + 1}
          </div>
        ))}
        {pages[pages.length - 1] < totalPages - 1 && (
          <div
            className="page"
            onClick={() => {
              loadPage(pages[pages.length - 1] + 1)
            }}
          >
            다음
          </div>
        )}
      </div>
    </>
  )
}

const DeleteGuestBookModal = ({
  postId,
  onSuccess,
}: {
  postId: number
  onSuccess: () => void
}) => {
  const inputRef = useRef({} as HTMLInputElement)
  const { closeModal } = useModal()
  const [loading, setLoading] = useState(false)

  return (
    <form
      id="guestbook-delete-form"
      className="form"
      onSubmit={async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
          const password = inputRef.current.value
          if (!password || password.length < RULES.password.minLength) {
            alert(`비밀번호를 ${RULES.password.minLength}자 이상 입력해주세요.`)
            return
          }

          if (password.length > RULES.password.maxLength) {
            alert(
              `비밀번호를 ${RULES.password.maxLength}자 이하로 입력해주세요.`,
            )
            return
          }

          const docRef = doc(db, "guestbook", String(postId));

          // 1) 삭제 요청 전에 동일한 password를 가진 update 요청을 보냄
          await updateDoc(docRef, { password: password });

          const updatedRef = doc(db, "guestbook", String(postId));

          // 2) Firestore 규칙에서 password 일치 시 delete 허용
          await deleteDoc(docRef);

          alert("삭제되었습니다.")
          closeModal()
          onSuccess()
        } catch {
          alert("방명록 삭제에 실패했습니다.")
        } finally {
          setLoading(false)
        }
      }}
    >
      <input
        disabled={loading}
        type="password"
        placeholder="비밀번호를 입력해주세요."
        className="password"
        ref={inputRef}
        maxLength={RULES.password.maxLength}
      />
    </form>
  )
}
