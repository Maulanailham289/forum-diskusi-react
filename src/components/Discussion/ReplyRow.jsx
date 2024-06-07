import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import { BiDislike, BiComment } from "react-icons/bi"
import { BsHeart, BsHeartFill, BsHeartbreak, BsHeartbreakFill } from "react-icons/bs"
import TextArea from '../Form/TextArea'
import Button from '../Form/Button'
import axiosInstance from '../../lib/axiosInstance'
import { EditorState } from 'draft-js'
import moment from 'moment'
import { stateToHTML } from 'draft-js-export-html'
import DraftEditor from '../Editor/DraftEditor'

const ReplyRow = ({ discussionId, data, level, mutate, className }) => {
    const { data: replies, error: repliesError, isLoading: repliesLoading, mutate: childMutate } = useSWR(`/replies?discussion=${discussionId}&parent=${data._id}`, url => axiosInstance.get(url).then(res => res.data))

    const [showInput, setShowInput] = useState(false)
    const [comment, setComment] = useState('')
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        setComment('')
    }, [showInput])

    const handleScore = async (val) => {
        if (processing)
            return
        try {
            setProcessing(true)
            let response = await axiosInstance.post(`/replies/${data._id}/score`, {
                score: val
            })
            mutate()
        } catch (error) {

        }
        setProcessing(false)
    }

    const deleteScore = async () => {
        if (processing)
            return
        try {
            let response = await axiosInstance.delete(`/replies/${data._id}/score`)
            mutate()
        } catch (error) {

        }
        setProcessing(false)
    }

    const submitReply = async (editorState) => {
        try {
            let response = await axiosInstance.post('/replies', {
                discussion_id: discussionId,
                parent_id: data._id,
                content: editorState
            })
            childMutate()
        } catch (error) {

        }
        setShowInput(false)
    }

    return (
        <div className={`relative flex flex-col bg-white pl-8 border-gray-400 mb-2 ${level != 0 && replies && replies.data.length > 0 ? `border-t border-b border-l ${level == 1 ? 'border-r rounded-3xl' : null} rounded-tl-3xl rounded-bl-3xl pt-2 pb-6` : ''}`}>
            <div className='flex flex-row w-full h-12 items-center z-0'>
                <div className='w-8 h-8 mr-4'>
                    <img src="/media/images/user.png" alt="" />
                </div>
                <div className='flex-col'>
                    <h1 className='text-xs'><span className='font-bold'>{data.user.firstname} {data.user.lastname}</span></h1>
                    <span className='text-xs'>{data.created_at ? moment.utc(data.created_at).startOf('minute').fromNow() : ''}</span>
                </div>
            </div>
            <div className="flex flex-col text-sm md:text-base mb-2" dangerouslySetInnerHTML={{ __html: data.content }}>
            </div>
            <div className="flex flex-row mb-2">
                <div className={`min-h-8 min-w-16 flex flex-row justify-between items-center mr-2 transition-colors ${data.user_score ? 'bg-primary-900 text-white' : 'bg-[#DFD0B8] text-black'} rounded-full`}>
                    {data.user_score == 1 ? (
                        <span onClick={deleteScore} className='cursor-pointer h-8 w-8 p-2 flex items-center justify-center hover:bg-primary-800 rounded-full'>
                            <BsHeartFill size={'14'} color='#fff' />
                        </span>
                    ) : (
                        <span onClick={() => handleScore(1)} className='cursor-pointer h-8 w-8 p-2 flex items-center justify-center hover:bg-gray-300 rounded-full'>
                            <BsHeart size={'15'} color={data.user_score ? '#fff' : '#000'} />
                        </span>
                    )}
                    <span className='mx-1 cursor-default text-sm'>{data.score}</span>
                    {data.user_score == -1 ? (
                        <span onClick={deleteScore} className='cursor-pointer h-8 w-8 p-2 flex items-center justify-center hover:bg-primary-800 rounded-full'>
                            <BsHeartbreakFill size={'14'} color='#fff' />
                        </span>
                    ) : (
                        <span onClick={() => handleScore(-1)} className='cursor-pointer h-8 w-8 p-2 flex items-center justify-center hover:bg-gray-300 rounded-full'>
                            <BsHeartbreak size={'15'} color={data.user_score ? '#fff' : '#000'} />
                        </span>
                    )}
                </div>
                <div onClick={() => setShowInput(prev => !prev)} className="cursor-pointer h-8 min-w-16 flex flex-row justify-center items-center px-2 bg-gray-200 hover:bg-gray-300 rounded-full">
                    <BiComment className='h-8 mr-2' size={'16'} />
                    <span className=' text-sm'>Reply</span>
                </div>
            </div>
            <div className=''></div>
            {showInput ? (
                <div className="flex flex-col mt-4">
                    <div className="border rounded-md mb-2">
                        <DraftEditor onSubmit={submitReply} />
                    </div>
                </div>
            ) : null}
            {level < 17 && replies && replies.data.length > 0 ? replies.data.map((reply, index) => (
                <ReplyRow className={'border-b border-l rounded-bl-3xl'} discussionId={discussionId} data={reply} level={level + 1} mutate={childMutate} />
            )) : null}
        </div>
    )
}

export default ReplyRow