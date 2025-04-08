import Husen from "@/components/Husen/Normal";
import { HUSEN_BLUE_COLOR, HUSEN_GREEN_COLOR ,HUSEN_RED_COLOR} from "@/const";

export default function Home() {
  return (
    <div>
      <Husen bgColor={HUSEN_BLUE_COLOR} content={"青の付箋"} />
      <Husen bgColor={HUSEN_GREEN_COLOR} content={"緑の付箋"} />
      <Husen bgColor={HUSEN_RED_COLOR} content={"赤の付箋"} />
    </div>
  );
}
