"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Loader, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ViewCode = ({ code }) => {
  const [output, setoutput] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const handleRun = async () => {
    try {
      setisLoading(true);
      const program = {
        script: code,
        language: "python3",
        versionIndex: "0",
        clientId: process.env.NEXT_PUBLIC_JDOODLE_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_JDOODLE_CLIENT_SECRET,
      };

      if (!code) {
        toast.error("kindly provide a code snippet");
      }

      const resp = await axios.post("/api/compiler", {
        program,
      });
      setoutput(resp.data);
      console.log(resp.data);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div>
      <div className="my-3 flex justify-end">
        <div className="flex items-center space-x-3">
          <Button
            className="bg-emerald-500 flex items-center space-x-2 hover:bg-emerald-500"
            size="sm"
            onClick={handleRun}
          >
            <Play />
            <div>Run</div>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-3">
          <Editor
            height="80vh"
            defaultLanguage="python"
            defaultValue="//happy coding"
            theme="vs-dark"
            value={code}
            className="text-blue-600"
          />
        </div>

        <Card className="col-span-2">
          <CardHeader className="border-b border-zinc-200/50">
            <CardTitle>Code Output</CardTitle>
            <CardDescription>
              This is where your output result will be displayed
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[50vh]">
                <div>
                  <Loader className="animate-spin" />
                </div>
              </div>
            ) : (
              <pre
                className={cn(
                  "bg-gray-500 rounded-sm p-2 text-white",
                  output.includes("SyntaxError") &&
                    "text-rose-700 font-bold bg-white",
                  output.includes("Traceback") &&
                    "text-rose-700 font-bold bg-white"
                )}
              >
                <code className="font-bold">{`>> ${output}`}</code>
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};