import Story from "../../components/story/Story";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@react-registry/avatar";

export default function AvatarDemo() {
  return (
    <>
      <Story
        title="Sizes"
        description="Tailwind size-* utilities scale the avatar. Fallback text shrinks accordingly."
      >
        <div className="flex items-end gap-4">
          <Avatar className="size-6">
            <AvatarFallback className="text-xs">XS</AvatarFallback>
          </Avatar>
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">SM</AvatarFallback>
          </Avatar>
          <Avatar className="size-10">
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
          <Avatar className="size-12">
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
          <Avatar className="size-16">
            <AvatarFallback>XL</AvatarFallback>
          </Avatar>
          <Avatar className="size-20">
            <AvatarFallback>2XL</AvatarFallback>
          </Avatar>
        </div>
      </Story>

      <Story
        title="Stack"
        description="Negative spacing + ring-2 ring-background creates the overlap."
      >
        <div className="flex -space-x-2">
          <Avatar className="ring-background size-8 ring-2">
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <Avatar className="ring-background size-8 ring-2">
            <AvatarFallback>RM</AvatarFallback>
          </Avatar>
          <Avatar className="ring-background size-8 ring-2">
            <AvatarFallback>PK</AvatarFallback>
          </Avatar>
          <Avatar className="ring-background size-8 ring-2">
            <AvatarFallback>+5</AvatarFallback>
          </Avatar>
        </div>
      </Story>

      <Story
        title="Avatar group"
        description="AvatarGroup auto-overlaps children and shows a +N overflow chip when max is exceeded."
      >
        <div className="space-y-3">
          <AvatarGroup max={3} size="default">
            <Avatar className="ring-background size-8 ring-2">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <Avatar className="ring-background size-8 ring-2">
              <AvatarFallback>RM</AvatarFallback>
            </Avatar>
            <Avatar className="ring-background size-8 ring-2">
              <AvatarFallback>PK</AvatarFallback>
            </Avatar>
            <Avatar className="ring-background size-8 ring-2">
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <Avatar className="ring-background size-8 ring-2">
              <AvatarFallback>LO</AvatarFallback>
            </Avatar>
          </AvatarGroup>

          <AvatarGroup overlap={false}>
            <Avatar className="size-8">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <Avatar className="size-8">
              <AvatarFallback>RM</AvatarFallback>
            </Avatar>
            <Avatar className="size-8">
              <AvatarFallback>PK</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </div>
      </Story>

      <Story
        title="With image (broken → fallback)"
        description="If AvatarImage fails to load, AvatarFallback renders automatically."
      >
        <Avatar className="size-12">
          <AvatarImage src="https://broken-url.example/img.jpg" alt="user" />
          <AvatarFallback>UI</AvatarFallback>
        </Avatar>
      </Story>
    </>
  );
}
