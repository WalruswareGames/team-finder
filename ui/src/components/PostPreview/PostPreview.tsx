import * as React from "react";
import cx from "classnames";
import { Post } from "../../model/post";
import { Button } from "../Button";
import { SkillList } from "../SkillList";
import { useBanUser, useDeletePost } from "../../queries/admin";
import { FavouritePostIndicator } from "../FavouritePostIndicator";
import teamSize1Icon from "./icons/1.svg"
import teamSize2Icon from "./icons/2.svg"
import teamSize3Icon from "./icons/3.svg"
import teamSize4PlusIcon from "./icons/4.svg"
import {Link} from "react-router-dom";

interface Props {
  post: Post;
  className?: string;
  adminView?: boolean;
  adminId?: string;
  showSkillText: boolean;
}

export const PostPreview: React.FC<Props> = ({
  post,
  className,
  adminView,
  adminId,
  showSkillText,
}) => {
  const deletePostMutation = useDeletePost();
  const banUserMutation = useBanUser();

  const description = post.description.length > 210 ? post.description.substring(0, 207) + "..." : post.description

  return (
    <article
      id={"post-" + post.id}
      className={cx(
        "relative bg-grey-500 border-2 border-neutral-900 rounded-xl p-2 grid grid-flow-row auto-cols-auto gap-y-2",
        className
      )}
    >
      <PreviewTitle post={post} />
      <SkillList
        label="Looking for:"
        skills={post.skillsSought}
        className="[--skill-color:theme(colors.blue-800)]"
        showText={showSkillText}
      />
      <SkillList
        label="Brings:"
        skills={post.skillsPossessed}
        className="[--skill-color:theme(colors.blue-900)]"
        showText={showSkillText}
      />
      <div className="break-words" style={{wordBreak: "break-word"}}>
        {description.split("\n").map((line, idx) => <p key={idx} className="mb-1">{line}</p>)}
      </div>

      <div className={`${adminView ? "flex justify-between" : "text-center"}`}>
        {adminView && (
          <>
            <Button
              style={{ backgroundColor: "red", maxHeight: "3em" }}
              onClick={() => deletePostMutation.mutate({ postId: post.id })}
            >
              Delete Post
            </Button>
            <Button
              style={{ backgroundColor: "red", maxHeight: "3em" }}
              onClick={() => {
                deletePostMutation.mutate({ postId: post.id });
                banUserMutation.mutate({
                  discordId: post.authorId,
                  adminId: adminId!,
                });
              }}
            >
              Delete Post & Ban User
            </Button>
          </>
        )}

        <div className="inline-block border-2 border-blue-200 rounded-xl text-orange-400 py-2 px-4 self-end" style={{ maxHeight: "3em" }}>
          <Link
            className="text-lg text-blue-200 font-bold"
            to={`/${post.id}`}
          >
            See more &gt;
          </Link>
        </div>
      </div>
    </article>
  );
};

export const PreviewTitle: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div className="flex justify-between min-w-0">
      <img src={getTeamSizeIcon(post.size)} className="inline-block mr-2" width={48} height={48} style={{maxHeight: "48px"}}  alt={`This team contains ${post.size} people`}/>
      <span className="grow" style={{width: "calc(100% - 100px)"}}>
        <h3 className="text-xl overflow-hidden text-ellipsis whitespace-nowrap">
          {post.author}
          <span className="text-sm">
            {post.size > 1
              ? ` and ${post.size - 1} others`
              : ``}
          </span>
        </h3>
      </span>
      <FavouritePostIndicator
        post={post}
        className={`cursor-pointer`}
      />
    </div>
  );
};

const getTeamSizeIcon = (size: number) => {
  switch (size) {
    case 1:
      return teamSize1Icon;
    case 2:
      return teamSize2Icon;
    case 3:
      return teamSize3Icon;
    default:
      return teamSize4PlusIcon;
  }
}
