import { PostObject } from "./Post";








type PostInfoObject = Omit<PostObject, 'id' | 'imageUrl' | 'comments'>;

type PostInfoProps = {
    post: PostInfoObject;
};



const PostInfo = ({ post }: PostInfoProps) => {

    return (

        <div className="flex items-center  space-x-4">
            {/* Rundes Bild links */}
            <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                <img
                    src={post.author?.profilePicture}
                    alt={post.author?.UserName}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Text rechts */}
            <div>
                <h1 className="text-lg font-semibold">{post.title}</h1>
                <h2 className="text-sm text-gray-500">{post.location}</h2>
            </div>
        </div>






    );


};













export default PostInfo;