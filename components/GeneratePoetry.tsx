import { GeneratePoetryProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid';
import { generateUploadUrl } from '@/convex/files'
import { useUploadFiles } from '@xixixao/uploadstuff/react'
import { useToast } from "@/components/ui/use-toast"


const useGeneratePoetry = ({
  setAudio, voicePrompt, setAudioStorageId
}: GeneratePoetryProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getAudioUrl = useMutation(api.poetries.getUrl);

  const { toast } = useToast();

  const generatePoetry = async (inputFile: File) => {
    setIsGenerating(true);
    setAudio('');


    if (!voicePrompt) {
      toast({
        title: "Please provide text for the poetry also",
      })
      return setIsGenerating(false);
    }

    if (!File) {
      toast({
        title: "Please provide audio file for poetry",
      })
      return setIsGenerating(false);
    }

    try {

      const fileName = `poetry-${uuidv4()}.mp3`; // Create a unique filename
      const file = new File([inputFile], fileName, { type: inputFile.type }); // Create a new File object with the unique filename

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;


      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Poetry generated successfully",
      })

    } catch (error) {
      console.log("Error generating Poetry", error);
      toast({
        title: "Error creating a poetry",
        variant: 'destructive',
      })
      setIsGenerating(false);
    }
  }

  return {
    isGenerating,
    generatePoetry
  }
}

const GeneratePoetry = (props: GeneratePoetryProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isGenerating, generatePoetry } = useGeneratePoetry(props);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }

  const handleSubmit = () => {
    if (selectedFile) {
      generatePoetry(selectedFile);
    } else {
      toast({
        title: "Please upload an audio file for poetry first",
      });
    }
  }

  return (
    <div>
      <div className='flex flex-col gap-2.5'>
        <Label className='text-16 font-bold text-white-1'>
          Write Poetry Here
        </Label>
        <Textarea
          className='input-class font-white focus-visible:ring-offset-orange-1'
          placeholder='Provide text to generate Poetry'
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
        <Label className='mt-6 text-16 font-bold text-white-1'>
          Give Audio for poetry and press Add Voice
        </Label>
        <div className='input-class mb-6 py-6 px-5 focus-visible:ring-offset-orange-1'>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className=' font-white focus-visible:ring-offset-orange-1'
          />
        </div>
      </div>
      <div className='mt-5 w-full max-w-[200px]'>
        <Button type='button' className="text-16 bg-orange-1 py-4 font-bold 
              text-white-1 transition-all" onClick={handleSubmit}>
          {isGenerating ? (<>
            Submitting...
            <Loader size={20} className="animate-spin ml-2" />
          </>) : (
            'Add Voice'
          )
          }
        </Button>
        {props.audio && (
          <audio src={props.audio}
            autoPlay
            className='mt-5'
            onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
          />
        )}
      </div>
    </div>
  )
}

export default GeneratePoetry
