"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import GeneratePoetry from "@/components/GeneratePoetry"
import GenerateThumbnail from "@/components/GenerateThumbnail"
import { ClipboardSignature, Loader } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/components/ui/use-toast"
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from "next/navigation"

const formSchema = z.object({
  poetryTitle: z.string().min(2),
  poetryDescription: z.string().min(2),
})

const CreatePoetry = () => {
  const router = useRouter();
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null)
  const [imageUrl, setImageUrl] = useState('');

  const [audioUrl, setAudioUrl] = useState('');
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null)
  const [audioDuration, setAudioDuration] = useState(0);
  const [voicePrompt, setVoicePrompt] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const createPoetry = useMutation(api.poetries.createPoetry);
  
  const {toast} = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      poetryTitle: "",
      poetryDescription: "",
    },
  })


  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      if(!audioUrl) {
        toast({
          title: 'Please give audio',
        })
        setIsSubmitting(false);
        throw new Error('Please give audio')
      }

      if(!imageUrl) {
        toast({
          title: 'Please give Image',
        })
        setIsSubmitting(false);
        throw new Error('Please give Image')
      }

      const poetry = await createPoetry({
        poetryTitle: data.poetryTitle,
        poetryDescription: data.poetryDescription,
        audioUrl,
        imageUrl,
        voicePrompt,
        views: 0,
        audioDuration,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
      });
      toast({ title: 'Poetry created' })
      setIsSubmitting(false);
      router.push('/')
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className='text-20 font-bold text-white-1'>Create Poetry</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex flex-col w-full">
          <div className="flex flex-col gap-[30px]
          border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="poetryTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">Title</FormLabel>
                  <FormControl>
                    <Input className="input-class focus-visible:ring-offset-orange-1" placeholder="JSM Poetry" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="poetryDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">Description</FormLabel>
                  <FormControl>
                    <Textarea className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Write a Short Poetry Description" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
            <GeneratePoetry
              setAudioStorageId={setAudioStorageId}
              setAudio={setAudioUrl}
              audio={audioUrl}
              voicePrompt={voicePrompt}
              setVoicePrompt={setVoicePrompt}
              setAudioDuration={setAudioDuration}
            />

            <GenerateThumbnail
              setImage={setImageUrl}
              setImageStorageId={setImageStorageId}
              image={imageUrl}
            />

            <div className="mt-10 w-full">
              <Button type="submit" className="text-16 w-full bg-orange-1 py-4 font-extrabold 
              text-white-1 transition-all duration-500 hover:bg-black-1">
                {isSubmitting ? (<>
                  Submitting...
                  <Loader size={20} className="animate-spin ml-2" />
                </>) : (
                  'Submit and Publish Poetry'
                )
                }
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default CreatePoetry;

