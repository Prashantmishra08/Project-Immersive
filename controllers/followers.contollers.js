import User from "../models/user.models.js"

const getUserChannelProfile = async(req, res) => {
    const { userName } = req.user

    if (!userName?.trim()) {
        return res.status(400).send("username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                userName: userName?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName:1,
                userName: 1,
                email:1,
                profession:1,
                about:1,
                avatar:1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                

            }
        }
    ])

    if (!channel?.length) {
        return res.status(404).send("channel does not exists")
    }

    return res
    .status(200)
    .json(
        ({
            message:"User channel fetched successfully",
            channel: channel[0],
        }) 
    )
}

export default getUserChannelProfile