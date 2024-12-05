import dayjs from "dayjs";
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deletePost, toggleLike } from "../../actions/post";

const PostItem = ({ post, showActions }) => {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);

  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${post.user}`}>
          <img className="round-img" src={post.avatar} alt="" />
          <h4>{post.name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{post.text}</p>
        <p className="post-date">
          Posted on {dayjs(post.date).format("DD/MM/YYYY")}
        </p>
        {showActions && (
          <Fragment>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => dispatch(toggleLike(post.id))}
            >
              <i className="fas fa-thumbs-up"></i>
              {post.likes.length > 0 && <span> {post.likes.length}</span>}
            </button>

            <Link to={`/posts/${post.id}`} className="btn btn-primary">
              Discussion{" "}
              {post.post_comments.length > 0 && (
                <span className="comment-count">{post.post_comments.length}</span>
              )}
            </Link>
            {!auth.loading && auth.user.id === post.user && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => dispatch(deletePost(post.id))}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true,
};

export default PostItem;
