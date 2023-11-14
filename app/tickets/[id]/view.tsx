'use client'

import _ from "lodash"
import { Tables } from "@/utils/supabase/database.types"
import { Plus } from "@/components/icons"
import { addComment, revertChanges, saveChanges } from "./actions"
import { ChangeEvent, useState, useEffect, use } from "react"

interface PageProps {
  ticket: Tables<'tickets'> & {email: string, comments: (Tables<'comments'> & {email: string})[]}
}

export default function View({ ticket }: PageProps) {
  const ticketCopy = _.clone(ticket)
  let [state, setState] = useState({
    ticket,
  })
  let [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (state.ticket.description === ticketCopy.description 
      && state.ticket.status === ticketCopy.status
      && state.ticket.title === ticketCopy.title) {
        setDisabled((d) => true)
    } else {
        setDisabled((d) => false)
    }
  }, [state])

  const changeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setState((s) => ({
      ticket: {
        ...s.ticket,
        description: e.target.value
      }
    }))
  }

  const changeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    setState((s) => ({
      ticket: {
        ...s.ticket,
        status: e.target.value as "NEW" | "IN-PROGRESS" | "RESOLVED"
      }
    }))
  }

  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setState((s) => ({
      ticket: {
        ...s.ticket,
        title: e.target.value
      }
    }))
  }

  return (
    <div aria-label="root-container" className="flex flex-col m-2">
      <form aria-label="ticket-data-container" className="mb-2 pb-5">
        <div className="flow flow-col">
          <label>
            Title
          </label>
          <input 
            className="rounded p-1 w-full text-black text-3xl" 
            defaultValue={ticket.title}
            name="title"
            onChange={changeTitle}
          />
        </div>
        <div aria-label="horizontal-group" className="flex gap-x-5">
          <div aria-label="label-input-container" className="flex flex-col">
            <label>
              Email
            </label>
            <input className="text-slate-500 rounded p-1" type="text" readOnly value={ticket.email}/>
          </div>
          <div aria-label="createdat-input-container" className="flex flex-col">
            <label>
              Created At
            </label>
            <input className="text-slate-500 rounded p-1" type="text" readOnly value={ticket.created_at}/>
          </div>
          <div aria-label="status-input-container" className="flex flex-col">
            <label>
              Status
            </label>
            <select 
              aria-label="status-select" 
              name="status" 
              defaultValue={ticket.status} 
              onChange={changeStatus}
              className="text-black rounded p-1"
            >
              <option>NEW</option>
              <option>IN-PROGRESS</option>
              <option>RESOLVED</option>
            </select>
          </div>
        </div>
        <div aria-label="description-textarea-container" className="flex flex-col">
          <label>
            Description
          </label>
          <textarea 
            className="text-black rounded p-1" 
            name="description" 
            defaultValue={ticket.description} 
            onChange={changeDescription}
          />
        </div>
        <div aria-label="action-container" className="flex gap-x-2 mt-2">
          <button className="bg-blue-400 rounded p-1 disabled:bg-blue-900" type="submit" disabled={disabled} formAction={saveChanges}>
            Save
          </button>
          <button className="bg-red-400 rounded p-1 disabled:bg-red-900" disabled={disabled} formAction={revertChanges}>
            Revert
          </button>
        </div>
        <input className="hidden" readOnly value={ticket.id} name="ticket-id"/>
      </form>
      <div aria-label="comments-data-container">
        <div aria-label="container-header" className="border-b pb-2">
          <h3>Comments</h3>
        </div>
        <div className="my-5 flex flex-col gap-y-2">
          { 
            ticket.comments && ticket.comments?.length > 0 
            ? 
            (
              ticket.comments.map((comment) => (
                <div key={comment.id} className="flex flex-col bg-slate-500 p-2 rounded">
                  <div className="flex flex-row gap-x-2">
                    <div className="flex flex-col">
                      <label>Email</label>
                      <p className="text-slate-300">{comment.email}</p>
                    </div>
                    <div className="flex flex-col">
                      <label>Created At</label>
                      <p className="text-slate-300">{comment.created_at}</p>
                    </div>
                  </div>
                  <div className="mt-2 bg-slate-700 text-slate-100 p-1 rounded">
                      <p>{comment.content}</p>
                  </div>
                </div>
              ))
            ) 
            : 
            (
              <div>No comments present...</div>
            )
          }
        </div>
        <form action={addComment} className="flex flex-col gap-y-2 pb-2">
          <textarea className="text-black rounded p-1" name="content" placeholder="comment text here..."/>
          <div className="flex flex-row">
            <button type="submit" className="bg-blue-400 text-white rounded flex flex-row p-1">
              <Plus/>
              Add Comment
            </button>
            <input className="hidden" readOnly value={ticket.id} name="ticket-id"/>
          </div>
        </form>
      </div>
    </div>
  )
}